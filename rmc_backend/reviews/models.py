from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from courses.models import Course  # Assuming this is in a separate app called 'courses'

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Review(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    take_again = models.BooleanField(default=False)
    grade = models.CharField(max_length=3)
    textbook_required = models.BooleanField(default=False)
    difficulty_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    overall_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    professor = models.CharField(max_length=255)
    online_course = models.BooleanField(default=False)
    attendance_mandatory = models.BooleanField(default=False)
    lectures_recorded = models.BooleanField(default=False)
    workload = models.CharField(max_length=20)
    description = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)
    semester = models.CharField(max_length=20)
    tags = models.ManyToManyField(Tag, related_name='reviews', blank=True)

    EXAM_FORMAT_CHOICES = [
        ('mcq_only', 'MCQ Only'),
        ('short_answer_only', 'Short Answer Only'),
        ('mcq_and_short_answer', 'MCQ and Short Answer')
    ]
    exam_format = models.CharField(max_length=25, choices=EXAM_FORMAT_CHOICES, default='mcq_only')

    class Meta:
        ordering = ['-review_date']  # Orders reviews by most recent first

    def __str__(self):
        return f"Review for {self.course} by {self.professor} - Rating: {self.overall_rating}"


