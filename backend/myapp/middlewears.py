
from django.shortcuts import redirect
def auth(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.user.is_authenticated:
            return view_func(request, *args, **kwargs)
        else:
            print("User is not authenticated")
            return redirect('login')
    return wrapper_func
