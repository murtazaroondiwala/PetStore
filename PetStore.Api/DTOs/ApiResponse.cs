namespace PetStore.Api.DTOs;

public class ApiResponse<T>
{
    public bool Success { get; private set; }
    public T? Data { get; private set; }
    public string? Error { get; private set; }
    public string? Message { get; private set; }

    private ApiResponse() { }

    public static ApiResponse<T> Ok(T data) => new() { Success = true, Data = data };
    public static ApiResponse<T> Ok(T data, string message) => new() { Success = true, Data = data, Message = message };
    public static ApiResponse<T> Fail(string error) => new() { Success = false, Error = error };
}
