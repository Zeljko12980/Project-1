using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class fixmeta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Meta_MetaId",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Meta",
                table: "Meta");

            migrationBuilder.RenameTable(
                name: "Meta",
                newName: "Metas");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Metas",
                table: "Metas",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Metas_MetaId",
                table: "Products",
                column: "MetaId",
                principalTable: "Metas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Metas_MetaId",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Metas",
                table: "Metas");

            migrationBuilder.RenameTable(
                name: "Metas",
                newName: "Meta");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Meta",
                table: "Meta",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Meta_MetaId",
                table: "Products",
                column: "MetaId",
                principalTable: "Meta",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
