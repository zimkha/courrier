<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', 'HomeController@index')->name('home');


Route::get('/page/{namepage}', function ($namepage)
{
    return view('pages.'.$namepage);
});

// Les actions de sauvegardes et de modifications
Route::post('/courrier', 'CourrierController@save');
Route::post('/change-status', 'CourrierController@changeStatusCourrier');
Route::get('/courrier/pdf/{id}', 'CourrierController@pdf');
Route::delete('/courrier/{id}', 'CourrierController@delete');


Route::get('/test', 'PlanController@test');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');




