
<?php
//    $paginator = [
//        "per_page" => 10,
//        "total" => 142,
//        "last_page" => 15,
//        "current_page" => 1
//    ];
    $paginator = json_decode(json_encode($paginator));
?>


<div class="kt-pagination kt-pagination--brand" style="width : 100%;justify-content: flex-end">

   {{-- @if(isset($per_pages) && !is_null($per_pages))
    <div class="kt-pagination__toolbar">
        <span class="pagination__desc">
            <?php echo __("pagination.per_page_display", ["nb" => $paginator->perPage(), "total" => $paginator->total()]) ?>
        </span>
        &nbsp;
        <select class="form-control kt-font-brand" id="per_page_select2" style="width: 60px">
            @foreach($per_pages as $per_page_value)
                <option value="{{ $per_page_value }}" @if($per_page_value == $paginator->perPage()) selected @endif >{{ $per_page_value }}</option>
            @endforeach
        </select>
    </div>
    @endif--}}

    {{--<div class="kt-pagination__toolbar">
        <span class="pagination__desc">
            {{ __("pagination.page") }}
        </span>
        &nbsp;
        <select class="form-control kt-font-brand kt-select2" id="page_index_select2" style="width: 60px">
            @for($page = 1; $page <= $paginator->last_page; $page++)
                <option value="{{ $page }}" @if($page == $paginator->current_page) selected @endif >{{ $page }}</option>
            @endfor
        </select>
    </div>--}}

    @if($paginator->last_page > 1)
    <ul class="kt-pagination__links">

        @if($paginator->last_page>1)
        <li class="kt-pagination__link--first">
            <a href="javascript:;" class="pagination-page-item" data-page="1" title="1" ><i class="fa fa-angle-double-left kt-font-brand"></i></a>
        </li>
        @endif

        <li class="kt-pagination__link--next @if($paginator->current_page == 1) disabled-li @endif " >
            <a href="javascript:;" class="pagination-page-item" data-page="{{ $paginator->current_page==1?1:$paginator->current_page - 1 }}" title="{{ $paginator->current_page==1?1:$paginator->current_page - 1 }}" ><i class="fa fa-angle-left kt-font-brand"></i></a>
        </li>

        <?php
            $per_segment = 3;
            $per_segment_pivot = (int)($paginator->current_page / $per_segment);
            $per_segment_pivot = ($paginator->current_page % $per_segment == 0) ? $per_segment_pivot - 1 : $per_segment_pivot;
            $per_segment_ref = $per_segment*$per_segment_pivot;
            $segment_from = $per_segment_ref + 1;
            $segment_to = $per_segment_ref + $per_segment;
            $segment_to = ($paginator->last_page == $segment_to + 1 ) ? $segment_to + 1 : min($segment_to,$paginator->last_page) ;
            $has_prev_pages = $segment_from > 1;
            $has_next_pages = $segment_to < $paginator->last_page;
        ?>

        @if($has_prev_pages)
        <li>
            <a href="javascript:;" class="pagination-page-item" data-page="{{ $segment_from - 1 }}" title="{{ $segment_from - 1 }}">...</a>
        </li>
        @endif

        @for($page = $segment_from ; $page <= $segment_to ; $page++ )
        <li class=" @if($page == $paginator->current_page) kt-pagination__link--active  @endif " >
            <a href="javascript:;" class="pagination-page-item" data-page="{{ $page }}" title="{{ $page }}" >{{ $page }}</a>
        </li>
        @endfor

        @if($has_next_pages)
        <li>
            <a href="javascript:;" class="pagination-page-item" data-page="{{ $segment_to + 1 }}" title="{{ $segment_to + 1 }}">...</a>
        </li>
        @endif

        <li class="kt-pagination__link--prev @if($paginator->current_page == $paginator->last_page) disabled-li @endif ">
            <a href="javascript:;" class="pagination-page-item" data-page="{{ $paginator->current_page==$paginator->last_page?$paginator->last_page:$paginator->current_page + 1 }}" title="{{ $paginator->current_page==$paginator->last_page?$paginator->last_page:$paginator->current_page + 1}}"  ><i class="fa fa-angle-right kt-font-brand"></i></a>
        </li>


        @if($paginator->last_page>1)
        <li class="kt-pagination__link--last">
            <a href="javascript:;" class="pagination-page-item" data-page="{{ $paginator->last_page }}" title="{{ $paginator->last_page }}" ><i class="fa fa-angle-double-right kt-font-brand"></i></a>
        </li>
        @endif
    </ul>
    @endif

</div>

