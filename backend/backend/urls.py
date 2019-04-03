"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from algorithms import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/posttext$', views.PostText.as_view(), name='post text file'),
    url(r'^api/v1/getwordlist$', views.SessionStart.as_view(), name='get words list'),
    url(r'^api/v1/getactivity$', views.GetActivity.as_view(), name='get activity'),
    url(r'^api/v1/postactivity$', views.PostActivity.as_view(), name='post activity'),
]
