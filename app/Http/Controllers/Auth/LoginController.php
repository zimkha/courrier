<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/#!/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }


    function authenticated(Request $request, $user)
    {
        if ($user->active == false)
        {
            Auth::logout();
            return Redirect::back()->withErrors(['msg'=>['Votre compte est désactivé, veuillez contacter l\'administration de SAMAKEUR pour plus d\'information']]);
        }
        return redirect('/#!/');
    }


    public function logout(Request $request)
    {
        Auth::logout();
        return redirect('/login');
    }
}
