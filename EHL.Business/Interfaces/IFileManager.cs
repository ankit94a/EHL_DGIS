using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Interfaces
{
	public interface IFileManager
	{
		public Task<AttachedFile> GetDoucmentById(long Id, string downloadType);
        public Task<bool> UploadPdf(PdfDocuments file);
        public PdfDocuments GetPdf(string type);
    }
}
