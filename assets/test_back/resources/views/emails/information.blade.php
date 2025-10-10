@extends('emails.email_template')


@section('content')
    <p>{{$standardMail->message}}</p>
@endsection
