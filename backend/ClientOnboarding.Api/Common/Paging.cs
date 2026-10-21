namespace ClientOnboarding.Api.Common;

public static class Paging
{
    public const int MaxSize = 50;

    public static (int Page, int Size) Normalise(int page, int size) =>
        (Math.Max(page, 0), Math.Clamp(size, 1, MaxSize));

    public static int TotalPages(int totalItems, int size) =>
        (int)Math.Ceiling(totalItems / (double)size);
}