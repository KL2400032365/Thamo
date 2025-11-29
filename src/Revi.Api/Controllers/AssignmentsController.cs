using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AssignmentsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public AssignmentsController(ApplicationDbContext db) => _db = db;

    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetByCourse(int courseId) => Ok(await _db.Assignments.Where(a => a.CourseId == courseId).ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(Assignment model)
    {
        _db.Assignments.Add(model);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetByCourse), new { courseId = model.CourseId }, model);
    }
}
