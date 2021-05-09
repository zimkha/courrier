<?php
namespace App\Http\Controllers;

use App\Contact;
use App\Outil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Redirect;


class ContactController extends Controller
{
    public $queryName = "contacts";
    public function save(Request $request)
    {
        try
        {

            DB::transaction(function() use($request){
                $errors = null;
                $item = new Contact();
                if(empty($request->email) || empty($request->message))
                {
                    $errors = "Veuillez vérifier tous les champs";
                }
                if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) 
                {
                    $errors = "Email invalide";
                }
                if(empty($errors))
                {
                    $item->message = $request->email;
                    $item->email   = $request->email;
                    $item->save();
                    return Outil::redirectgraphql($this->queryName, "id:{$item->id}", Outil::$queries[$this->queryName]);

                }
                throw new \Exception($errors);

            });
        }
        catch(Exception $e)
        {
            return response()->json(array(
                'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                'errors_debug'    => [$e->getMessage()],
            ));
        }
    }

    public function delete($id)
    {
        try
        {
            DB::transaction(function() use($id){
                $errors = null;
                $data = 0;
                if(isset($id))
                {
                   $item = Contact::find($id);
                   if(isset($item))
                   {
                       $item->delete();
                       $data = 1;
                   }
                }
            });
        }
        catch(Exception $e)
        {

        }
    }
}