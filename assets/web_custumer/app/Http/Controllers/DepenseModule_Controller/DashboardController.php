<?php

namespace App\Http\Controllers\DepenseModule_Controller;

use App\Http\Controllers\Controller;
use App\RequestAPIClass;
use App\MenuCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class DashboardController extends Controller
{
    public function index(){
        // Activer le menu Dépenses
        spx_set_selected_menu(MenuCode::$EXPENSE);
        return view("DepenseModule_Views.index");
    }
}
