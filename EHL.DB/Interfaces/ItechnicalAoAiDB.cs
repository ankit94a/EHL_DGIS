using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EHL.Common.Models;
namespace EHL.DB.Interfaces
{
    public interface ItechnicalAoAiDB
    {
        public List<TechnicalAoAi> GetList();

        public bool AddTechnicalAoAi(TechnicalAoAi technicalAoAi);
        public Task<bool> UpdateTechnicalAoAi(TechnicalAoAi technicalAoAi);
    }
}
