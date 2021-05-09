<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Post;
use App\Outil;

class PostController extends Controller
{
    private $queryName = "posts";

    public function save(Request $request)
    {
        try
        {
            return DB::transaction(function() use($request)
            {
                $errors = null;
                $item = new Post();
                // dd($request->all());
                if(isset($request->id))
                {
                    $item  = Post::find($request->id);
                }
                if(empty($request->image))
                {
                    $errors = "Veuillez chosir un fichier";
                }
                if(empty($request->description))
                {
                    $errors = "Veuillez definir la description";
                }
                if (!isset($errors) && $request->hasFile('image') )
                {
                    $fichier = $_FILES['image']['name'];
                    $fichier_tmp = $_FILES['image']['tmp_name'];
                    $k = rand(100, 9999);
                    $ext = explode('.',$fichier);
                    $rename = config('view.uploads')['posts']."/posts_".$k.".".end($ext);
                    move_uploaded_file($fichier_tmp,$rename);
                    $item->fichier = $rename;

                }
                if(!isset($errors))
                {
                    $item->description = $request->description;
                    $item->save();
                    return Outil::redirectgraphql($this->queryName, "id:{$item->id}", Outil::$queries[$this->queryName]);

                }
                throw new \Exception($errors);
            });
        }
        catch(\Exception $e)
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
            return DB::transaction(function() use($id)
            {
                $errors = null;
                $data = 0;
                if(isset($id))
                {
                  $item = Post::find($id);
                  if(isset($item))
                  {
                      $item->delete();
                      $data = 1;
                       $retour = array(
                                'data'          => $data,
                            );
                            return response()->json($retour);
                  }
                  else
                  {
                      $errors = "Donnees introuvable";
                      throw new \Exception($errors);
                  }
                 
                }
                else
                {
                    $errors = "Données manquante";
                    throw new \Exception($errors);

                }
            });
           
        }
        catch(\Exception $e)
        {
            return response()->json(array(
                'errors'          => config('app.debug') ? $e->getMessage() : Outil::getMsgError(),
                'errors_debug'    => [$e->getMessage()],
            ));
        }
    }
}
