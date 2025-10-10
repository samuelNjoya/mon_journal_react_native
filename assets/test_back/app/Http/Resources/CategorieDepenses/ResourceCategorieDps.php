<?php

namespace App\Http\Resources\CategorieDepenses;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ResourceCategorieDps extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'type' => $this->type ? "categorie Personnalisé" : "catégorie par défaut",
            'phone_number_custumer' => optional($this->CustomerAccount)->phone_number,
            'created_at' => Carbon::parse($this->created_at)->format('d/m/Y H:i:s'),
        ];
    }
}
