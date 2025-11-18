from django.db import models


class Article(models.Model):
    ASSET_CLASS_CHOICES = [
        ("equity", "Equity"),
        ("fx", "FX / Currencies"),
        ("crypto", "Crypto"),
        ("commodities", "Commodities"),
        ("macro", "Macro / Rates"),
        ("other", "Other"),
    ]

    SENTIMENT_CHOICES = [
        ("bullish", "Bullish"),
        ("bearish", "Bearish"),
        ("neutral", "Neutral"),
    ]

    title = models.CharField(max_length=255)
    source = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    summary = models.TextField(blank=True)
    asset_class = models.CharField(
        max_length=20, choices=ASSET_CLASS_CHOICES, blank=True
    )
    sentiment = models.CharField(
        max_length=20, choices=SENTIMENT_CHOICES, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title[:100]
