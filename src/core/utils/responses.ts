import { NextResponse } from "next/server";
import { logger } from "@/core/utils/logger";

export const SuccessResponse = <T>(data: T, message?: string) =>
  NextResponse.json({ data, status: true, message }, { status: 200 });

export const ListResponse = <T>(data: T[], totalPages: number, message?: string) =>
  NextResponse.json({ data, totalPages, message }, { status: 200 });

export const BadRequestResponse = (error: string) => {
  logger.error(error);
  return NextResponse.json({ error }, { status: 400 });
};

export const NotFoundResponse = (error: string) => {
  logger.error(error);
  return NextResponse.json({ error }, { status: 404 });
};

export const ErrorResponse = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : "An unknown error occurred";
  logger.error(message);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
};

export const UnauthorizedResponse = (error: string) => {
  logger.error(error);
  return NextResponse.json({ error }, { status: 401 });
};
