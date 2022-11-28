<style>
    ul.ds-quick-info {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
    ul.ds-quick-info > li {
        display: inline-block;
    }
    ul.ds-quick-info > li:first-child {
        margin-right: 150px;
    }
    ul.ds-quick-info > li:first-child:after {
        font-family: "Font Awesome 6 Free";
        content: '\f054';
        font-weight: 900;
        font-size: 60px;
        color: #409EFF;
        position: fixed;
        margin-left: 50px;
        margin-top: 60px;
    }
    ul.ds-quick-info .card {
        width: 380px;
        display: inline-block;
    }
    ul.ds-quick-info .card > .card-header {
        background-color: #868e96;
        color: #fff;
        height: 100px;
        padding: 20px;
        font-size: 25px;
    }
    ul.ds-quick-info .card > .card-header > .version {
        font-size: 18px;
    }
    ul.ds-quick-info .db-name {
        font-size: 30px;
        font-weight: bold;
        color: #666;
        padding: 20px 0px;
    }
    ul.ds-quick-info .db-name:before {
        font-family: "Font Awesome 6 Free";
        content: "\f1c0";
        font-weight: 900;
        margin-right: 5px;
    }
</style>

<fieldset class="card-set animate__animated animate__fadeIn" id="option-set">
    <div class="card-body">
        <h5 class="card-title text-left">
            Transfer Options
            <label class="float-end">3/4</label>
        </h5>

        <div class="mt-5 mb-5 text-center">

            <ul class="ds-quick-info">
            </ul>
        </div>

        <div class="mb-4">
            <label class="form-label">Table Name Pattern</label>
            <input type="text" class="form-control w-25" id="txtTableNamePattern" placeholder="Leave empty or fill % for match all.">
        </div>
    </div>

    <div class="form-card-footer text-end p-3">

        <ul class="actions-footer">
            <li>
                <button type="button" class="btn btn-light btn-wizard-previous" data-previous-set="#destination-set">
                    <i class="fa-solid fa-chevron-left"></i>
                    Previous
                </button>
            </li>
            <li>
                <button type="button" class="btn btn-light btn-wizard-next" data-next-set="#tables-set">
                    Next
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </li>
        </ul>
    </div>
</fieldset>