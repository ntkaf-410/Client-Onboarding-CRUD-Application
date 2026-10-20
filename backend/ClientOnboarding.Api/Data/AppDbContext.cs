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
        modelBuilder.Entity<Personal>(entity =>
        {
            entity.ToTable("personal");
            entity.HasKey(p => p.Id);
            entity.Property(p => p. Id).ValueGeneratedOnAdd();
            entity.Property(p => p.CreatedAt).HasColumnType("timestamp without time zone").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(p => p.UpdatedAt).HasColumnType("timestamp without time zone");
            entity.Property(p => p.Title).HasMaxLength(10);
            entity.Property(p => p.FirstName).HasMaxLength(50);
            entity.Property(p => p.MiddleName).HasMaxLength(50);
            entity.Property(p => p.LastName).HasMaxLength(50);
            entity.Property(p => p.Gender).HasMaxLength(10);
            entity.Property(p => p.MaritalStatus).HasMaxLength(15);
            entity.Property(p => p.Nationality).HasMaxLength(60);
            entity.Property(p => p.IdType).HasMaxLength(20);
            entity.Property(p => p.IdNumber).HasMaxLength(30);
            entity.Property(p => p.Email).HasMaxLength(150);
            entity.Property(p => p.MobileNumber).HasMaxLength(20);
            entity.Property(p => p.Occupation).HasMaxLength(100);
            entity.Property(p => p.EmploymentStatus).HasMaxLength(20);
        });
    
    }
}