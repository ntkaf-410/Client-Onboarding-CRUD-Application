using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace ClientOnboarding.Api.Common;

public static class DbErrors
{
    public static bool IsUniqueViolation(DbUpdateException ex) =>
        ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation };
}