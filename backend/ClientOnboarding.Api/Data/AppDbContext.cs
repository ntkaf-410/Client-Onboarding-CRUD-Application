using ClientOnboarding.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClientOnboarding.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){
    }

    public DbSet<Personal> Personals => Set<Personal>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
    }
}