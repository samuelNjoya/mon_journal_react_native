<?php

namespace App\Http\Resources\CategorieDepenses;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ResourceDepenses extends JsonResource
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
        'libelle' => $this->libelle,
        'montant' => $this->montant,
        'is_repetitive' => $this->is_repetitive,
        'date_debut' => Carbon::parse($this->date_debut)->format('d/m/Y'),
        'date_fin' => Carbon::parse($this->date_fin)->format('d/m/Y'),
       //piece_jointe' => $this->piece_jointe,
        'status_is_repetitive' => $this->status_is_repetitive,
       // 'phone_number_custumer' => optional($this->CustomerAccount)->phone_number,
        'categorie_id' => optional($this->categorieDepense)->id,
        'budget_id' => optional(
             $this->categorieDepense->budgets->firstWhere('IdBudget', $this->IdBudget)
        )->IdBudget ?? null,
       // 'created_at' => Carbon::parse($this->created_at)->format('d/m/Y H:i:s'),
    ];
    }
}
