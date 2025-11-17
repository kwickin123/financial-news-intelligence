from django.urls import path
from .views import article_list_create

urlpatterns = [
    path("articles/", article_list_create, name="article_list_with_slash"),
    path("articles", article_list_create, name="article_list_no_slash"),
]
