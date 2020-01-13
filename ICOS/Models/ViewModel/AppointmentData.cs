using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ICOS.Models.ViewModel
{
    public class AppointmentData
    {
        public int Id { get; set; }

        public string Subject { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public int GroupId { get; set; }
    }
}
