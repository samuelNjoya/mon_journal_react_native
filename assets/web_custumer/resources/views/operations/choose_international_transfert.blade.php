<!DOCTYPE html>

<html lang="en">

	<!-- begin::Head -->
	<head>

		<!--begin::Base Path (base relative path for assets of this page) -->
		<base href="../">

		<!--end::Base Path -->
		<meta charset="utf-8" />
		<title>Sesampayx | Home</title>
		<meta name="description" content="Latest updates and statistic charts">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

		<!--begin:: Global Optional Vendors -->

		<link href="{{asset('assets/vendors/general/summernote/dist/summernote.css')}}" rel="stylesheet" type="text/css" />
		<link href="{{asset('assets/vendors/general/bootstrap-markdown/css/bootstrap-markdown.min.css')}}" rel="stylesheet" type="text/css" />

		<link href="{{asset('assets/css/demo11/style.bundle.css')}}" rel="stylesheet" type="text/css" />

		<!--end::Layout Skins -->
		<link rel="shortcut icon" href="{{ asset('assets/media/logos/logo_sesampayx.png') }}"/>
	</head>

	<!-- end::Head -->

	<!-- begin::Body -->
	<body class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--fixed kt-subheader--enabled kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading">





                    <!--Begin::Dashboard 3-->

                    <!--Begin::Row-->
                    <div class="row" style="margin: auto;">
                        <div class="col-lg-6 col-xl-6 order-lg-1 order-xl-1">

                            <!--begin:: Widgets/Trends-->
                            <div class="kt-portlet kt-portlet--head--noborder kt-portlet--height-fluid" style="background-color:#ffebd0;">
                                <div class="kt-portlet__head kt-portlet__head--noborder">
                                    <div class="kt-portlet__head-label">
                                        <h3 class="kt-portlet__head-title">
                                            <strong style="font-size:20px;">Comptes de privilèges</strong>
                                        </h3>
                                    </div>

                                </div>
                                <div class="kt-portlet__body kt-portlet__body--fluid kt-portlet__body--fit">
                                    <a href="{{ route('spx.signin') }}">
                                        <img src="{{asset('img/ecp.png')}}" alt="">
                                    </a>
                                </div>
                            </div>

                            <!--end:: Widgets/Trends-->
                        </div>
                        <div class="col-lg-6 col-xl-6 order-lg-1 order-xl-1">

                            <!--begin:: Widgets/Sales Stats-->
                            <div class="kt-portlet kt-portlet--head--noborder kt-portlet--height-fluid" style="background-color:#ffebd0;">
                                <div class="kt-portlet__head kt-portlet__head--noborder">
                                    <div class="kt-portlet__head-label">
                                        <h3 class="kt-portlet__head-title">
                                            <strong style="font-size:20px;">Transfert international</strong>
                                        </h3>
                                    </div>
                                </div>
                                <div class="kt-portlet__body">

                                    <a href="{{ route('spx.get.inter_trans_form') }}">
                                        <img src="{{asset('img/trans_inter1.png')}}" alt="" style="width: 500px;"/>
                                    </a>

                                    <!--end::Widget 6-->
                                </div>
                            </div>

                            <!--end:: Widgets/Sales Stats-->
                        </div>
                    </div>

                    <!--End::Row-->


		<!--begin:: Global Optional Vendors -->
		<script src="{{asset('assets/vendors/general/jquery-form/dist/jquery.form.min.js')}}" type="text/javascript"></script>
		<script src="{{asset('assets/vendors/general/bootstrap-markdown/js/bootstrap-markdown.js')}}" type="text/javascript"></script>
		<script src="{{asset('assets/vendors/custom/js/vendors/bootstrap-markdown.init.js')}}" type="text/javascript"></script>

		<!--end:: Global Optional Vendors -->

		<!--begin::Global Theme Bundle(used by all pages) -->
		<script src="./assets/js/demo3/scripts.bundle.js" type="text/javascript"></script>


		<!--end::Page Vendors -->

		<!--begin::Page Scripts(used by this page) -->
		<script src="{{asset('assets/js/demo3/pages/dashboard.js')}}" type="text/javascript"></script>

		<!--end::Page Scripts -->
	</body>

	<!-- end::Body -->
</html>
