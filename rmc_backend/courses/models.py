from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=100)
    code = models.CharField(max_length=20, default='DEFAULT_CODE')
    category = models.CharField(max_length=100, default='DEFAULT_CATEGORY')

    def __str__(self):
        return f"{self.code}: {self.title}"