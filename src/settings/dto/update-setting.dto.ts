import { IsString, IsOptional } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  value: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateAnalyticsSettingsDto {
  @IsString()
  @IsOptional()
  gaPropertyId?: string;

  @IsString()
  @IsOptional()
  gaCredentials?: string; // JSON string of service account credentials
}
