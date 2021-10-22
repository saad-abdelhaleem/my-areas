using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RegionsBoundaries.Pages
{
    public class AreasModel : PageModel
    {
        private readonly ILogger<AreasModel> _logger;

        public AreasModel(ILogger<AreasModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}