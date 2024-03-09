from rest_framework import routers
from api.views import APIViewSet

router = routers.SimpleRouter()
router.register(r'api', APIViewSet, basename='detect')

urlpatterns = [
    *router.urls,
]