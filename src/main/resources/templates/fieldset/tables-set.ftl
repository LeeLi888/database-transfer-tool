<fieldset class="card-set animate__animated animate__fadeIn" id="tables-set">
    <div class="card-body">
        <h5 class="card-title text-left">
            Tables list
            <span class="tables-selected-text"></span>
            <label class="float-end">4/4</label>
        </h5>

        <div class="mt-4 table-container">
            <table class="table table-hover" id="table-list">
                <thead>
                <th>#</th>
                <th class="check">
                    <input class="form-check-input" type="checkbox" value="1" id="chk-tables">
                </th>
                <th></th>
                <th class="source"></th>
                <th class="destination"></th>
                <th class="comment"></th>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>

    <div class="form-card-footer text-end p-3">
        <div class="status-set" id="status-tables-set">

        </div>

        <ul class="actions-footer">
            <li>
                <button type="button" class="btn btn-light btn-wizard-previous" data-previous-set="#option-set">
                    <i class="fa-solid fa-chevron-left"></i>
                    Previous
                </button>
            </li>
            <li>
                <button type="button" class="btn btn-primary" id="btnSubmit" disabled>
                    Submit
                </button>
            </li>
        </ul>
    </div>
</fieldset>