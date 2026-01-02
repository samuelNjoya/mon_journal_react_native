
<div class="row">
    <div class="col-xl-12">
        <div class="kt-portlet">
            <div class="kt-portlet__head">
                <div class="kt-portlet__head-label">
                    <h3 class="kt-portlet__head-title">Informations Personnelles </h3>
                </div>
                <div class="kt-portlet__head-toolbar">
                    <div class="kt-portlet__head-wrapper">
                    </div>
                </div>
            </div>
            <form class="kt-form kt-form--label-right">
                <div class="kt-portlet__body">
                    <div class="kt-section kt-section--first">
                        <div class="kt-section__body">

                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Nom</label>
                                <div class="col-lg-9 col-xl-6">
                                    <input class="form-control" type="text" value="{{$user->person->firstname}}" readonly>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Prénom</label>
                                <div class="col-lg-9 col-xl-6">
                                    <input class="form-control" type="text" value="{{$user->person->lastname}}" readonly>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Date de Naissance</label>
                                <div class="col-lg-9 col-xl-6">
                                    <input class="form-control" type="text" value="{{spx_format_date($user->person->birthdate)}}" readonly>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Sexe</label>
                                <div class="col-lg-9 col-xl-6">
                                    <input class="form-control" type="text" value="{{$user->person->gender}}" readonly>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Numéro de Téléphone</label>
                                <div class="col-lg-9 col-xl-6">
                                    <div class="input-group">
                                        <div class="input-group-prepend"><span class="input-group-text"><i class="la la-phone"></i></span></div>
                                        <input type="text" class="form-control" value="+{{$user->customer_account->phone_number}}" placeholder="Phone" aria-describedby="basic-addon1" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Couriel</label>
                                <div class="col-lg-9 col-xl-6">
                                    <div class="input-group">
                                        <input type="text" class="form-control" value="{{$user->customer_account->email}}" placeholder="Phone" aria-describedby="basic-addon1" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-xl-3 col-lg-3 col-form-label">Adresse</label>
                                <div class="col-lg-9 col-xl-6">
                                    <div class="input-group">
                                        <input type="text" class="form-control" value="{{$user->person->address}}" placeholder="Email" aria-describedby="basic-addon1" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
