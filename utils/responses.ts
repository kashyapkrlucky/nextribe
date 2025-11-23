import { NextResponse } from "next/server";

export const SuccessResponse = <T>(data: T) => {
    return NextResponse.json({
        status: 200,
        data,
    });
};

//list responses
export const ListResponse = <T>(data: T[], totalPages: number) => {
    return NextResponse.json({
        status: 200,
        data,
        totalPages,
    });
};

export const ErrorResponse = (error: string) => {
    return NextResponse.json({
        status: 500,
        error,
    });
};

export const NotFoundResponse = (error: string) => {
    return NextResponse.json({
        status: 404,
        error,
    });
};

export const BadRequestResponse = (error: string) => {
    return NextResponse.json({
        status: 400,
        error,
    });
};
