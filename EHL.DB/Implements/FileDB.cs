using Dapper;
using EHL.Common.Helpers;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Implements
{
	public class FileDB : BaseDB, IFileDB
	{
		public FileDB(IConfiguration configuration) : base(configuration)
		{

		}

		public async Task<AttachedFile> GetDocumentById(long Id, string downloadType)
		{
			try
			{
				string query = "SELECT * FROM documents WHERE id = @id";
				var result = await connection.QueryFirstOrDefaultAsync<AttachedFile>(query, new { id = Id });
				return result;
			}
			catch(Exception ex)
			{
				EHLLogger.Error(ex, "Class=FileDB,method=GetDocumentById");
				throw;
			}			
		}
        public async Task<bool> UploadPdf(PdfDocuments file)
        {
            try
            {
                string insertQuery = @"
            INSERT INTO PdfDocument (FileType, FileStorage, CreatedBy, UpdatedBy, CreatedOn, UpdatedOn, IsDeleted, IsActive)
            VALUES (@FileType, @FileStorage, @CreatedBy, @UpdatedBy, @CreatedOn, @UpdatedOn, @IsDeleted, @IsActive);
            SELECT CAST(SCOPE_IDENTITY() AS bigint);";

                var id = await connection.ExecuteScalarAsync<long>(insertQuery, file);
                file.Id = id;

                return id > 0;
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, "Class=FileDB, method=UploadPdf");
                throw;
            }
        }


        public  PdfDocuments GetPdf(string FileType)
        {
            try
            {
                string query = "SELECT * FROM PdfDocument WHERE FileType = @FileType";
                var result =  connection.QueryFirstOrDefault<PdfDocuments>(query, new { FileType });
                return result;
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, "Class=FileDB, Method=GetPdf");
                throw;
            }
        }



    }
}
