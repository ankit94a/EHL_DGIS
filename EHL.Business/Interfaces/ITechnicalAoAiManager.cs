using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EHL.Common.Models;

namespace EHL.Business.Interfaces
{
    public interface ITechnicalAoAiManager
    {
        public List<TechnicalAoAi> GetList();

        public Task<bool> AddTechnicalAoAi(TechnicalAoAi technicalAoAi );
        public Task<bool> UpdateTechnicalAoAi(TechnicalAoAi technicalAoAi);
    }
}
