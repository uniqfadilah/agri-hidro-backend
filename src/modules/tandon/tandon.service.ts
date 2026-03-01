import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomInt } from 'node:crypto';

import { Tandon, TandonReport } from '../../models';
import { FirebaseService } from '../firebase/firebase.service';
import { PushService } from '../push/push.service';
import { DeviceUpdateWaterDto } from './dto/device-update-water.dto';
import { CreateTandonDto } from './dto/create-tandon.dto';
import { UpdateTandonDto } from './dto/update-tandon.dto';

export type TandonResponse = {
  id: string;
  name: string | null;
  code: string;
  jwt_secret: string;
  max_level_water: number;
  min_level_water: number;
  current_level_water: number;
  tandon_height: number | null;
  status: 'full' | 'refill';
  createdAt: Date;
  updatedAt: Date;
};

export type TandonReportResponse = {
  id: string;
  tandon_code: string;
  createdAt: Date;
  updatedAt: Date;
};

function randomDigits(length: number): string {
  return Array.from({ length }, () => randomInt(0, 10)).join('');
}

@Injectable()
export class TandonService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly pushService: PushService,
  ) {}

  async findAll(): Promise<TandonResponse[]> {
    const rows = await Tandon.query()
      .select(
        'id',
        'name',
        'code',
        'jwt_secret',
        'max_level_water',
        'min_level_water',
        'current_level_water',
        'tandon_height',
        'status',
        'created_at',
        'updated_at',
      )
      .orderBy('created_at', 'desc');
    return rows.map((r) => this.toResponse(r));
  }

  async findOne(id: string): Promise<TandonResponse> {
    const row = await Tandon.query().findById(id);
    if (!row) {
      throw new NotFoundException('Tandon not found');
    }
    return this.toResponse(row);
  }

  async findReportsByTandonCode(code: string): Promise<TandonReportResponse[]> {
    const rows = await TandonReport.query()
      .where('tandon_code', code)
      .orderBy('created_at', 'desc');
    return rows.map((r) => ({
      id: r.id,
      tandon_code: r.tandonCode,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async create(dto: CreateTandonDto): Promise<TandonResponse> {
    const tandonHeight = Number(dto.tandon_height);
    this.validateWaterLevels(
      dto.max_level_water,
      dto.min_level_water,
      dto.current_level_water,
      tandonHeight,
    );

    let code = dto.code ?? randomDigits(4);
    const jwtSecret = dto.jwt_secret ?? randomDigits(8);

    const existingCode = await Tandon.query().findOne({ code });
    if (existingCode) {
      for (let i = 0; i < 100; i++) {
        code = randomDigits(4);
        const again = await Tandon.query().findOne({ code });
        if (!again) break;
      }
      const stillExists = await Tandon.query().findOne({ code });
      if (stillExists) {
        throw new ConflictException('Unable to generate unique code');
      }
    }

    const insertPayload: Record<string, string> = {
      name: dto.name,
      code,
      jwtSecret,
      maxLevelWater: String(dto.max_level_water),
      minLevelWater: String(dto.min_level_water),
      currentLevelWater: String(dto.current_level_water),
      tandonHeight: String(dto.tandon_height),
      status: dto.status as 'full' | 'refill',
    };
    const tandon = await Tandon.query().insertAndFetch(insertPayload);
    return this.toResponse(tandon);
  }

  async update(id: string, dto: UpdateTandonDto): Promise<TandonResponse> {
    const row = await Tandon.query().findById(id);
    if (!row) {
      throw new NotFoundException('Tandon not found');
    }

    const maxLevel =
      dto.max_level_water !== undefined
        ? dto.max_level_water
        : Number(row.maxLevelWater);
    const minLevel =
      dto.min_level_water !== undefined
        ? dto.min_level_water
        : Number(row.minLevelWater);
    const currentLevel =
      dto.current_level_water !== undefined
        ? dto.current_level_water
        : Number(row.currentLevelWater);

    const tandonHeight: number | null =
      dto.tandon_height != null
        ? Number(dto.tandon_height)
        : row.tandonHeight != null && row.tandonHeight !== ''
          ? Number(row.tandonHeight)
          : null;
    if (
      dto.max_level_water !== undefined ||
      dto.min_level_water !== undefined
    ) {
      this.validateWaterLevels(maxLevel, minLevel, currentLevel, tandonHeight);
    } else if (dto.current_level_water !== undefined) {
      this.validateWaterLevels(maxLevel, minLevel, currentLevel, tandonHeight);
    }

    if (dto.code !== undefined) {
      const existing = await Tandon.query()
        .where('code', dto.code)
        .whereNot('id', id)
        .first();
      if (existing) {
        throw new ConflictException('A tandon with this code already exists');
      }
    }

    const patch: Record<string, string | null | Date> = {
      updatedAt: new Date(),
    };
    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.code !== undefined) patch.code = dto.code;
    if (dto.jwt_secret !== undefined) patch.jwtSecret = dto.jwt_secret;
    if (dto.max_level_water !== undefined)
      patch.maxLevelWater = String(dto.max_level_water);
    if (dto.min_level_water !== undefined)
      patch.minLevelWater = String(dto.min_level_water);
    if (dto.current_level_water !== undefined)
      patch.currentLevelWater = String(dto.current_level_water);
    if (dto.tandon_height !== undefined)
      patch.tandonHeight =
        dto.tandon_height == null ? null : String(dto.tandon_height);

    const updated = await Tandon.query().patchAndFetchById(id, patch);
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const row = await Tandon.query().findById(id);
    if (!row) {
      throw new NotFoundException('Tandon not found');
    }
    await Tandon.query().deleteById(id);
  }

  async deviceUpdateWater(dto: DeviceUpdateWaterDto): Promise<TandonResponse> {
    const tandon = await Tandon.query().findOne({ code: dto.code });
    if (!tandon) {
      throw new NotFoundException('Tandon not found');
    }

    if (dto.jwt_secret !== tandon.jwtSecret) {
      throw new UnauthorizedException('Invalid jwt_secret');
    }
    const valueToStore = dto.current_level_water;
    const minLevel = Number(tandon.minLevelWater);
    const maxLevel = Number(tandon.maxLevelWater);

    if (valueToStore <= minLevel && tandon.status !== 'refill') {
      await Tandon.query().patchAndFetchById(tandon.id, { status: 'refill' });
      await TandonReport.query().insert({ tandonCode: tandon.code });
      const tokens = await this.pushService.getTokens();
      await this.firebaseService.sendTandonStatusNotification(
        tandon.code,
        'refill',
        tandon.name,
        tokens,
      );
    } else if (valueToStore >= maxLevel && tandon.status !== 'full') {
      await Tandon.query().patchAndFetchById(tandon.id, { status: 'full' });
      const latest = await TandonReport.query()
        .where('tandon_code', tandon.code)
        .orderBy('created_at', 'desc')
        .first();
      if (latest) {
        await TandonReport.query().patchAndFetchById(latest.id, {
          updatedAt: new Date(),
        });
      }
      const tokens = await this.pushService.getTokens();
      await this.firebaseService.sendTandonStatusNotification(
        tandon.code,
        'full',
        tandon.name,
        tokens,
      );
    }

    const updated = await Tandon.query().patchAndFetchById(tandon.id, {
      currentLevelWater: String(valueToStore),
      updatedAt: new Date(),
    });
    return this.toResponse(updated);
  }

  private validateWaterLevels(
    maxLevel: number,
    minLevel: number,
    currentLevel: number,
    tandonHeight: number | null = null,
  ): void {
    if (tandonHeight != null && tandonHeight > 0) {
      if (maxLevel > tandonHeight) {
        throw new BadRequestException(
          `max_level_water cannot exceed tandon_height (${tandonHeight})`,
        );
      }
      if (minLevel > tandonHeight) {
        throw new BadRequestException(
          `min_level_water cannot exceed tandon_height (${tandonHeight})`,
        );
      }
      if (currentLevel > tandonHeight) {
        throw new BadRequestException(
          `current_level_water cannot exceed tandon_height (${tandonHeight})`,
        );
      }
    }
    if (maxLevel <= minLevel) {
      throw new BadRequestException(
        'max_level_water must be greater than min_level_water',
      );
    }
    if (currentLevel < minLevel || currentLevel > maxLevel) {
      throw new BadRequestException(
        'current_level_water must be between min_level_water and max_level_water',
      );
    }
  }

  private toResponse(row: Tandon): TandonResponse {
    return {
      id: row.id,
      name: row.name ?? null,
      code: row.code,
      jwt_secret: row.jwtSecret,
      max_level_water: Number(row.maxLevelWater),
      min_level_water: Number(row.minLevelWater),
      current_level_water: Number(row.currentLevelWater),
      tandon_height: row.tandonHeight != null ? Number(row.tandonHeight) : null,
      status: row?.status as 'full' | 'refill',
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
