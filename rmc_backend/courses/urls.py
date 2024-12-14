from django.urls import path
from . import views

urlpatterns = [
    path('', views.course_list, name='course_list'),
    # path('courses/', views.course_list, name='course_list'),  # Frontend course list route
    path('<str:code>/', views.course_detail, name='course_detail'),  # Frontend course detail route
    # path('api/courses/', views.course_list, name='api_course_list'),  # API route for course list
    # path('api/courses/<str:code>/', views.course_detail, name='api_course_detail'),  # API route for course detail
]