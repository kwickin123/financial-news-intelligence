import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateformat import DateFormat

from .models import Article
from .utils import generate_summary


@csrf_exempt
def article_list_create(request):
    print(">>> article_list_create called with method:", request.method)

    if request.method == "GET":
        articles = Article.objects.order_by("-created_at")
        data = [
            {
                "id": a.id,
                "title": a.title,
                "source": a.source,
                "summary": a.summary,
                "content": a.content,
                "asset_class": a.asset_class,
                "sentiment": a.sentiment,
                "created_at": DateFormat(a.created_at).format("Y-m-d H:i"),
            }
            for a in articles
        ]
        print(">>> returning", len(data), "articles")
        return JsonResponse({"articles": data}, status=200)

    if request.method == "POST":
        print(">>> handling POST, raw body:", request.body)

        try:
            body = json.loads(request.body.decode("utf-8"))
        except json.JSONDecodeError:
            print(">>> JSON decode error")
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        title = body.get("title", "").strip()
        source = body.get("source", "").strip()
        content = body.get("content", "").strip()
        asset_class = body.get("asset_class", "").strip()
        sentiment = body.get("sentiment", "").strip()

        print(">>> parsed body:", body)

        if not title or not content:
            print(">>> missing title/content")
            return JsonResponse(
                {"error": "title and content are required"}, status=400
            )

        summary = generate_summary(content)
        print(">>> generated summary:", summary[:80], "...")

        article = Article.objects.create(
            title=title,
            source=source,
            content=content,
            summary=summary,
            asset_class=asset_class,
            sentiment=sentiment,
        )

        print(">>> created article with id:", article.id)

        return JsonResponse(
            {
                "id": article.id,
                "title": article.title,
                "source": article.source,
                "summary": article.summary,
                "content": article.content,
                "asset_class": article.asset_class,
                "sentiment": article.sentiment,
                "created_at": DateFormat(article.created_at).format("Y-m-d H:i"),
            },
            status=201,
        )

    print(">>> method not allowed:", request.method)
    return HttpResponseNotAllowed(["GET", "POST"])
