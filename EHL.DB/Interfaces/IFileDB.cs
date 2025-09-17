using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Interfaces
{
	public interface IFileDB
	{
		Task<AttachedFile> GetDocumentById(long Id, string downloadType);
        Task<bool> UploadPdf(PdfDocuments file);
        PdfDocuments GetPdf(string FileType);

    }
}
