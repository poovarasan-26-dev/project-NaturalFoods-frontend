from .models import SiteSetting


def site_settings(request):
    settings = SiteSetting.objects.filter(is_active=True)
    data = {}
    for s in settings:
        data[s.key] = s.value
    return {"site_settings": data}
