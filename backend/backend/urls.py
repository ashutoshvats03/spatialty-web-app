from django.contrib import admin
from django.urls import path
from myapp import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('dashboard/', views.Dashboard.as_view(), name='Dashboard'),
    path('adminLogin/', views.AdminLogin.as_view(), name='AdminLogin'),
    path('deleteUser/<int:userid>/', views.DeleteUser.as_view(), name='DeleteUser'),
    path('addUser/', views.AddUser.as_view(), name='AddUser'),
    path('modifyUser/', views.ModifyUser.as_view(), name='ModifyUser'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
