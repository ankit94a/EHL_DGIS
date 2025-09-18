using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using static EHL.Common.Enum.Enum;

namespace EHL.Business.Implements
{
	public class FileManager : IFileManager
	{
		private readonly IFileDB _fileDB;
		public FileManager(IFileDB fileDB)
		{
			_fileDB = fileDB;
		}
		public async Task<AttachedFile> GetDoucmentById(long Id, string downloadType)
		{
			return await _fileDB.GetDocumentById(Id, downloadType);
		}
        public Task<bool> UploadPdf(PdfDocuments file)
        {
            return _fileDB.UploadPdf(file);
        }
        public PdfDocuments GetPdf(string type)
        {
			return _fileDB.GetPdf(type);
        }

	
    }
}
