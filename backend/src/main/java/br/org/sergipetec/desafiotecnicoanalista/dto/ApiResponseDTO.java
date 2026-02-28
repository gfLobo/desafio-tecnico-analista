package br.org.sergipetec.desafiotecnicoanalista.dto;

import java.util.List;
import java.util.StringJoiner;

public record ApiResponseDTO<T>(
        boolean success,
        String message,
        T data
) {
    public static <T> ApiResponseDTO<T> ok(T data) {
        return new ApiResponseDTO<>(true, null, data);
    }

    public static <T> ApiResponseDTO<T> error(String message) {
        return new ApiResponseDTO<>(false, message, null);
    }

    public static <T> ApiResponseDTO<T> error(String message, T data) {
        return new ApiResponseDTO<>(false, message, data);
    }
}

