from django.shortcuts import render, redirect, get_object_or_404
from .models import Course, Review, Tag
from django.http import JsonResponse, HttpResponseBadRequest
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import json

def course_detail(request, code):
    course = get_object_or_404(Course, code=code)
    reviews = Review.objects.filter(course=course).order_by('-review_date')

    # Calculate ratings and other metrics
    rating_distribution = {i: 0 for i in range(1, 6)}
    total_reviews = reviews.count()
    total_overall_ratings = sum(review.overall_rating for review in reviews)
    total_difficulty_ratings = sum(review.difficulty_rating for review in reviews)
    retake_count = reviews.filter(take_again=True).count()

    for review in reviews:
        if 1 <= review.overall_rating <= 5:
            rating_distribution[review.overall_rating] += 1

    average_overall_rating = (total_overall_ratings / total_reviews) if total_reviews > 0 else 0
    average_difficulty_rating = (total_difficulty_ratings / total_reviews) if total_reviews > 0 else 0
    retake_percentage = (retake_count / total_reviews * 100) if total_reviews > 0 else 0

    context = {
        'course': course,
        'reviews': reviews,
        'rating_distribution': rating_distribution,
        'average_overall_rating': average_overall_rating,
        'average_difficulty_rating': average_difficulty_rating,
        'retake_percentage': retake_percentage,
    }
    # return render(request, 'courses/course_detail.html', context)
    return JsonResponse(context)

@csrf_exempt
def handle_review_submission(request, code):
    # Get the course by its code, or return a 404 if not found
    course = get_object_or_404(Course, code=code)

    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)

            # Create the review object
            review = Review.objects.create(
                course=course,
                take_again=data.get('take_again', False),
                grade=data.get('grade', ''),
                textbook_required=data.get('textbook_required', False),
                difficulty_rating=int(data.get('difficulty_rating', 0)),
                overall_rating=int(data.get('overall_rating', 0)),
                professor=data.get('professor', ''),
                online_course=data.get('online_course', False),
                attendance_mandatory=data.get('attendance_mandatory', False),
                lectures_recorded=data.get('lectures_recorded', False),
                workload=data.get('workload', ''),
                description=data.get('description', ''),
                review_date=timezone.now(),
                semester=data.get('semester', ''),
                exam_format=data.get('exam_format', '')
            )

            review.save()

            # Handle tags if they are included in the request
            tag_names = data.get('tags', [])
            print(tag_names)
            if tag_names:
                tags = Tag.objects.filter(name__in=tag_names)
                review.tags.set(tags)  # Set the tags for the review

            return JsonResponse({'message': 'Review submitted successfully'}, status=201)

        except (ValueError, KeyError) as e:
            return HttpResponseBadRequest("Invalid form submission.")

    return HttpResponseBadRequest("Invalid request method.")

def get_csrf_token(request):
    return render(request, 'review_details.html')