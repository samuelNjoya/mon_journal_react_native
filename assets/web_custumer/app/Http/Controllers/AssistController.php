<?php

namespace App\Http\Controllers;

use App\MenuCode;
use Illuminate\Http\Request;

class AssistController extends Controller
{
    public function getTickets(Request $request){
        spx_set_selected_menu(MenuCode::$TICKET);
        return response()->view('assistance.tickets');
    }
    public function getFaq(Request $request){
        spx_set_selected_menu(MenuCode::$FAQ);
        return response()->view('assistance.faq');
    }
    public function getAnnounces(Request $request){
        spx_set_selected_menu(MenuCode::$ANNOUNCE);
        return response()->view('assistance.announces');
    }
}
