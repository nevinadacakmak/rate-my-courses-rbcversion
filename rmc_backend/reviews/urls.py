from django.urls import path
from .views import course_detail, handle_review_submission, get_csrf_token

urlpatterns = [
    path('<str:code>/', course_detail, name='course_detail'),
    path('<str:code>/submit_review/', handle_review_submission, name='handle_review_submission'),
    path('', get_csrf_token, name='get_csrfToken')
    # path('submit/', submit_review, name='submit_review'),
]