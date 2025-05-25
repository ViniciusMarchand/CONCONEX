using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class add_notification_token : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPushToken_AspNetUsers_UserId",
                table: "UserPushToken");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserPushToken",
                table: "UserPushToken");

            migrationBuilder.RenameTable(
                name: "UserPushToken",
                newName: "UserPushTokens");

            migrationBuilder.RenameIndex(
                name: "IX_UserPushToken_UserId",
                table: "UserPushTokens",
                newName: "IX_UserPushTokens_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserPushTokens",
                table: "UserPushTokens",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPushTokens_AspNetUsers_UserId",
                table: "UserPushTokens",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPushTokens_AspNetUsers_UserId",
                table: "UserPushTokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserPushTokens",
                table: "UserPushTokens");

            migrationBuilder.RenameTable(
                name: "UserPushTokens",
                newName: "UserPushToken");

            migrationBuilder.RenameIndex(
                name: "IX_UserPushTokens_UserId",
                table: "UserPushToken",
                newName: "IX_UserPushToken_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserPushToken",
                table: "UserPushToken",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPushToken_AspNetUsers_UserId",
                table: "UserPushToken",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
