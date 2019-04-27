<?php

namespace Laravel\Http\Controllers;

use Illuminate\Http\Request;
use Response;

class ArquivoController extends Controller
{
    //

    public function carregaArquivo (Request $request){
    	if($request->hasFile('filegrafo')){
    		$file = $request->file('filegrafo');
    		$content = file_get_contents($file->getRealPath());
    		/*$validatedData = $request->validate({
    			'filegrafo' => 'required|json'
    		});*/
    		//$json = file_get_content($file);
    		$response['success'] = true;
    		$response['data'] = $content;
    		return Response::json($response);
    	}
    }
}
