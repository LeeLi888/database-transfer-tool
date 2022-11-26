<fieldset class="card-set animate__animated animate__fadeIn" id="destination-set">
    <div class="card-body">
        <h5 class="card-title text-left">
            Destination Database Setting
            <label class="float-end">2/4</label>
        </h5>

        <div class="mt-4 mb-4">
            <select class="form-select w-25" name="destination-db-type">
                <option value="" disabled selected>Please select Database Type</option>
                <option value="mysql">MySql</option>
                <option value="mssql">Microsoft SQL Server</option>
                <option value="mariadb">mariadb</option>
                <option value="postgresql">postgresql</option>
            </select>
            <p class="driver-class-name-p"></p>
            <input type="hidden" name="destination-db-driver-class-name">
        </div>
        <div class="mb-4">
            <input type="text" class="form-control" name="destination-db-url" placeholder="Connection URL for JDBC Driver">
        </div>
        <div class="mb-4">
            <input type="text" class="form-control w-25" name="destination-db-username" placeholder="User Name">
        </div>
        <div class="mb-4">
            <input type="password" class="form-control w-25" name="destination-db-password" placeholder="Password">
        </div>

    </div>

    <div class="form-card-footer text-end p-3">
        <ul class="actions-footer">
            <li>
                <button type="button" class="btn btn-success " id="btn-destination-connection-test">
                    Connection Test
                </button>
            </li>
            <li>
                <button type="button" class="btn btn-light btn-wizard-previous" data-previous-set="#source-set">
                    <i class="fa-solid fa-chevron-left"></i>
                    Previous
                </button>
            </li>
            <li>
                <button type="button" class="btn btn-light btn-wizard-next" data-next-set="#option-set">
                    Next
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </li>
        </ul>
    </div>

</fieldset>