import { SetMetadata } from "@nestjs/common";

export const HasPremissons = (...args:string[])=> SetMetadata('premissons', args)