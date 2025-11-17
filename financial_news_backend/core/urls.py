from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("articles.urls")),  # or "news.urls" if that’s your app name
]
