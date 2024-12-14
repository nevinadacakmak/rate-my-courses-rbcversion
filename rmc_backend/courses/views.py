from django.shortcuts import render, get_object_or_404
from .models import Course
from reviews.models import Review
from django.http import JsonResponse

def course_detail(request, code):
    course = get_object_or_404(Course, code=code)
    reviews = Review.objects.filter(course=course).order_by('-review_date')

    course_data = {
        'course': {
            'code': course.code,
            'title': course.title,
            'category': course.category
        },
        'reviews': [
            {
                'id': review.id,  # Include review ID for React key prop
                'description': review.description,
                'professor': review.professor,
                'overall_rating': review.overall_rating,
                'difficulty_rating': review.difficulty_rating,
                'workload': review.workload,
                'take_again': review.take_again,
                'attendance_mandatory': review.attendance_mandatory,
                'grade': review.grade,
                'review_date': review.review_date.strftime('%Y-%m-%d'),
                'semester': review.semester,
                'tags': [tag.name for tag in review.tags.all()],
                'online_course': review.online_course,
                'textbook_required': review.textbook_required,
                'lectures_recorded': review.lectures_recorded
                
            }
            for review in reviews
        ],
    }

    return JsonResponse(course_data)


def course_list(request):
    # Fetch all courses
    courses = Course.objects.all()

    # Debugging: print the fetched courses
    # print(f"Fetched courses: {courses}")

    # Prepare course data
    course_data = [{'code': course.code, 'title': course.title, 'category': course.category} for course in courses]

    # Debugging: print the formatted data
    # print(f"Course data: {course_data}")

    # Return the data as JSON
    return JsonResponse({'courses': course_data}, safe=False)
